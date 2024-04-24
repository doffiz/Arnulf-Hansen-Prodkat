import { useState, useEffect } from 'react';

interface BoatBuilderProps {
    url: string;
}

const BoatBuilder: React.FC<BoatBuilderProps> = ({ url }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const handleOpen = () => {
        document.body.classList.add('overflow-hidden');
        setIsOpen(true);
    };

    const handleClose = () => {
        document.body.classList.remove('overflow-hidden');
        setIsOpen(false);
    };

    useEffect(() => {
        if (isOpen) {
            setIsLoading(true);
        }
    }, [isOpen]);

    return (
        <div>
            <button 
                className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleOpen}
            >
                Bygg din båt
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex p-4 items-center justify-center z-50">
                    <div className="bg-white w-full h-full relative">
                        <button 
                            className="absolute text-4xl     top-0 right-6 m-2 text-2xl font-bold cursor-pointer"
                            onClick={handleClose}
                        >
                            &times;
                        </button>
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
                            </div>
                        )}
                        <iframe 
                            src={url} 
                            title="Boat Builder" 
                            className="w-full h-full"
                            onLoad={() => setTimeout(() => setIsLoading(false), 2000)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default BoatBuilder;