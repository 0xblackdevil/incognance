// import walletSigner from "../service/signerCnf"


export default function AdminPanel() {

    const getSigner = () =>{
        // console.log(walletSigner);
        console.log("temp");

    }


    return (
        <>
        <h1>Admin Panel</h1>
        <button onClick={getSigner}>get Signer</button></>
    )
}