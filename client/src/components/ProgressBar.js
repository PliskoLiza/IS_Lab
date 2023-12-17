import '../css/progressbar.css';

const ProgressBarComponent = ({ percentage, label }) => {
    // Interpolate color between red and green based on percentage
    const interpolateColor = (percentage) => {
        const red = 255 - Math.round((255 * percentage) / 100);
        const green = Math.round((255 * percentage) / 100);
        return `rgb(${red}, ${green}, 0)`;
    };

    return (
        <div className="progress-bar-container">
            <div
                className="progress-bar-fill"
                style={{
                    width: `${percentage}%`,
                    backgroundColor: interpolateColor(percentage),
                }}
            ></div>
            <span className="progress-bar-label">{label}</span>
        </div>
    );
};

export default ProgressBarComponent;
