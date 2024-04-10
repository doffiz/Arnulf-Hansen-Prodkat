import React from 'react';

type LangBeskrivelseProps = {
    langBeskrivelse: { children: { text: string }[] }[];
};

const LangBeskrivelseComponent: React.FC<LangBeskrivelseProps> = ({ langBeskrivelse }) => {
    return (
        <section className="bg-slate-950 text-white py-12">

        <div className="max-w-[1300px] p-8 mx-auto">
            <h2 className="text-5xl font-bold text-center my-12">Beskrivelse</h2>
            {langBeskrivelse.map((item, index) => (
                <p key={index} className="mb-4">
                    {item.children.map((child, childIndex) => (
                        <span key={childIndex}>{child.text}</span>
                        ))}
                </p>
            ))}
        </div>
            </section>
    );
};

export default LangBeskrivelseComponent;