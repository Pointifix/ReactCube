import React, {useRef} from "react";
import './Inputs.css';

const Inputs: React.FC<{
    color: string,
    onColorChange: (newColor: string) => void,
    onRotationDirectionChange: (newRotation: { axis: "x" | "y", speed: number }) => void
}> = ({color, onColorChange, onRotationDirectionChange}) => {
    const colorInputRef = useRef<HTMLInputElement | null>(null);

    const handleContainerClick = () => {
        if (colorInputRef.current) {
            colorInputRef.current.click();
        }
    };

    const handleRotation = (axis: "x" | "y", speed: number) => {
        onRotationDirectionChange({axis: axis, speed: speed});
    };

    return (
        <>
            <div id="input">
                <button
                    onMouseDown={() => handleRotation("x", 1)}
                    onMouseUp={() => handleRotation("x", 0)}
                    onMouseLeave={() => handleRotation("x", 0)}
                >Rotate around x-axis
                </button>
                <button
                    onMouseDown={() => handleRotation("y", 1)}
                    onMouseUp={() => handleRotation("y", 0)}
                    onMouseLeave={() => handleRotation("y", 0)}
                >Rotate around y-axis
                </button>
                <button onClick={handleContainerClick}>
                    Pick color
                </button>
            </div>
            <input
                type="color"
                ref={colorInputRef}
                value={color}
                onChange={(e) => onColorChange(e.target.value)}
            />
        </>
    );
}

export default Inputs;