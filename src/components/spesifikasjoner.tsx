import React from "react";
import { Spec, SpecsGridProps } from "@/types";

const SpecsGrid: React.FC<SpecsGridProps> = ({ specs }) => {
    const groupedSpecs = specs.reduce<Record<string, Spec[]>>((groups, spec) => {
        (groups[spec.group] = groups[spec.group] || []).push(spec);
        return groups;
    }, {});

    return (
        <section className="max-w-[1300px] mx-auto p-8 py-16">
            <h2 className="text-5xl font-bold text-center my-12">Spesifikasjoner</h2>
            <div className="grid grid-cols-2 gap-12">
                {Object.entries(groupedSpecs).map(([group, specs]) => (
                    <div key={group}>
                        <h3 className="font-bold text-3xl mb-2">{group}</h3>
                        <div className="h-[1px] w-full bg-slate-400 opacity-20 mb-4"></div>
                         {specs.map((spec: Spec, index:number) => (
                            <div key={spec.label} className={`flex justify-between ${index % 2 === 0 ? '' : 'bg-gray-200'}`}>
                                <span className="font-semibold">{spec.label}</span>
                                <span>
                                    {Array.isArray(spec.value) && typeof spec.value[0] === 'string'
                                        ? Array.from(new Set(spec.value[0].split(/\s+/))).join(' ')
                                        : spec.value.join(", ")}
                                </span>
</div>
                        ))}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default SpecsGrid;