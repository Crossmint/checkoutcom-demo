import Image from 'next/image';
import Link from 'next/link';

interface CompletedProps {
    amountUSD: string;
    tokenAmount: string;
    paymentMethod: string;
    receiptEmail: string;
}

function formatAmount(amount: string): string {
    const num = parseFloat(amount);
    return num.toFixed(2);
}

function formatTokenAmount(amount: string): string {
    const num = parseFloat(amount);
    return num.toFixed(Math.min(7, amount.split('.')[1]?.length || 0));
}

export function Completed({ amountUSD, tokenAmount, paymentMethod, receiptEmail }: CompletedProps) {
    return (
        <div className="w-full max-w-[400px] sm:max-w-[600px] md:max-w-[600px] mx-auto px-6 md:px-10">
            <div className="bg-white p-6 md:p-10 rounded-lg">
                <div className="flex flex-col w-full">
                    <div className="flex flex-col items-center">
                        <CheckIcon />
                        <h1 className="font-medium text-[#E1B45B] mt-2 text-[20px]">Order complete</h1>
                        <h1 className="text-[#060735] font-medium text-[30px] mt-2">${formatAmount(amountUSD)}</h1>
                        <h2 className="text-[#A4AFB2] font-medium text-[16px]">{formatTokenAmount(tokenAmount)} $TRUMP</h2>
                    </div>

                    <div className="w-full mt-6">
                        <h1 className="text-[#00150D] font-semibold text-[18px]">Purchased token</h1>
                        <div className="flex flex-row gap-6 mt-6">
                            <div className="rounded-full overflow-hidden w-[48px] h-[48px] relative self-start">
                                <Image
                                    src="/trump_fight.png"
                                    alt="Trump Fight"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[#00150D] text-[16px] font-normal">$TRUMP Official</span>
                                <span className="text-[#67797F] text-[16px] font-normal">Trump MEME</span>
                            </div>
                            <div className="flex flex-col ml-auto">
                                <span className="text-[#67797F] text-[16px] font-normal">${formatAmount(amountUSD)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="w-full h-[1px] bg-[#E5E7EB] mt-6"></div>
                    <div className="w-full mt-6">
                        <h1 className="text-[#00150D] font-semibold text-[18px]">Purchase info</h1>
                        <div className="flex justify-between mt-4">
                            <span className="text-[#67797F] text-[16px] font-normal">Payment method</span>
                            <span className="text-[#67797F] text-[16px] font-normal">{paymentMethod}</span>
                        </div>
                        <div className="flex justify-between mt-1">
                            <span className="text-[#67797F] text-[16px] font-normal">Receipt</span>
                            <span className="text-[#67797F] text-[16px] font-normal">{receiptEmail}</span>
                        </div>
                    </div>
                    <Link href="/wallet" className="w-full">
                        <button className="w-full bg-transparent text-[#00150D] font-medium text-[16px] rounded-full py-4 mt-12 border border-[#D0D5DD]">
                            Done
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}


function CheckIcon() {

    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" fill="none">
            <g opacity="0.9">
                <path
                    d="M37.5 50L45.8333 58.3333L62.5 41.6667M87.5 50C87.5 70.7107 70.7107 87.5 50 87.5C29.2893 87.5 12.5 70.7107 12.5 50C12.5 29.2893 29.2893 12.5 50 12.5C70.7107 12.5 87.5 29.2893 87.5 50Z"
                    stroke="#E1B45B"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </g>
        </svg>
    );
}