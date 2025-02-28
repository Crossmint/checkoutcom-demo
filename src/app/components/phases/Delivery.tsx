import { PaperPlaneAnimation } from "../animations/PaperPlaneAnimation";

export function Delivery() {
    return (
        <div className="w-full max-w-[400px] sm:max-w-[600px] md:max-w-[600px] mx-auto px-6 md:px-10">
            <div className="bg-white p-6 md:p-10 rounded-lg">
                <div className="flex flex-col items-center justify-center min-h-[300px]">
                    <PaperPlaneAnimation />
                    <div className="flex flex-col items-center mt-6">
                        <h1 className="text-[20px] font-semibold leading-[27.81px]">Order in progress...</h1>
                        <p className="text-[16px] text-gray-500 leading-[27.81px]">Less than 1 minute</p>
                    </div>
                </div>
            </div>
        </div>
    );
}