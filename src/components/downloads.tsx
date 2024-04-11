import React from 'react';

interface Katalog {
    filesize: number;
    navn: string;
    url: string;
}

interface KatalogerProps {
    kataloger: Katalog[];
}

const KatalogerComponent: React.FC<KatalogerProps> = ({ kataloger }) => {
    return (
        <section className='max-w-[1300px] mx-auto text-center flex flex-col gap-2 py-16'>
                        <h2 className="text-5xl font-bold text-center my-12">Nedlastninger</h2>
            {kataloger.map((katalog, index) => {
                const fileSizeInMB = (katalog.filesize / (1024 * 1024)).toFixed(2);
                const fileType = katalog.url.split('.').pop();

                return (
                    <div key={index} className="flex gap-2 items-end justify-center">
                        <a href={katalog.url} download className="text-blue-500 text-3xl hover:underline">
                            {katalog.navn}
                        </a>
                        <p>({fileSizeInMB}MB .{fileType})</p>
                    </div>
                );
            })}
        </section>
    );
};

export default KatalogerComponent;