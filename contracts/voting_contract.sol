// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract DidVotingContract{

    struct Proposal{
        string name;
        string description;
        uint votes;
    }

    struct Session{
        string[] proposal_name;
        mapping(uint => Proposal)  proposals;
        mapping(string=>bool)  voters;
        uint endingTime;
    }

    mapping(uint => Session) public votingSession;
    uint[] sessions;

    event newSessionGenerate(uint session_id, uint endTime);
    event newProposalSuubmited(uint session_id, uint proposal_id);

    function createVotingSession(uint _endTime) public {
        uint sessionId = block.timestamp;
        votingSession[sessionId].endingTime = _endTime;
        sessions.push(sessionId);
        emit newSessionGenerate(sessionId, _endTime);
    }

    function createProposal(uint _sessionId, string memory _name, string memory _description) public {
        uint proposalId = votingSession[_sessionId].proposal_name.length;
        
        votingSession[_sessionId].proposal_name.push(_name);
        votingSession[_sessionId].proposals[proposalId] = Proposal({
            name: _name,
            description: _description,
            votes: 0
        });
        emit newProposalSuubmited(_sessionId, proposalId);
    }

    function submitVote(uint _sessionId, uint _proposalNumber, string memory _did) public {
        require(!votingSession[_sessionId].voters[_did], "Already voted");
        votingSession[_sessionId].voters[_did] = true;
        votingSession[_sessionId].proposals[_proposalNumber].votes++;
    }

    function getSessions() public view returns(uint[] memory){
        return sessions;
    }

    function viewResuult(uint _sessionNumber,uint _proposalNumber) public view returns(uint){
        return votingSession[_sessionNumber].proposals[_proposalNumber].votes;
    }

    function viewProposals(uint _sessionId) public view returns(string[] memory){
        return votingSession[_sessionId].proposal_name;
    }

    function viewProposal(uint _sessionId, uint _proposalIndex) public view returns(Proposal memory){
        return votingSession[_sessionId].proposals[_proposalIndex];
    }
}