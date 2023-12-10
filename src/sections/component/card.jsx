import { useEffect } from "react";


export default function CardComponent(cardData) {
    useEffect(()=>{
        console.log( + cardData.index);
    });

    
    return (
        <div>
            <div class="bg-white grid grid-rows-4 grid-flow-row gap-4 shadow-lg p-4 rounded-lg">
                <div class="row-span-4">{cardData.index}</div>
                <div class="col-span-2 font-bold">{cardData.cardData}</div>
                <div class="row-span-3 col-span-2 font-light text-justify ">Using Lorem ipsum to focus attention on graphic elements in a webpage design proposal · One of the earliest examples</div>
                <div class="row-span-1 col-span-4 text-center">
                    <button class="w-full text-center bg-indigo-700 text-white p-3 rounded-lg font-bold">Vote</button>
                </div>
            </div>
        </div>
    );
}