import cityJson from './vendor/city';

const blinkingDot = `
    <svg width="10px" height="10px" viewBox="0 0 10 10" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <circle cx="5" cy="5" r="1.5" fill="#0052FF">
            <animate
                attributeName="opacity"
                calcMode="spline"
                values="1;0"
                keyTimes="0;1"
                dur="1"
                keySplines="0.2 0 0.8 1"
                begin="0s"
                repeatCount="indefinite"
            />
            <animate attributeName="r" calcMode="spline" values="0;3" keyTimes="0;1" dur="1" keySplines="0 0.2 0.8 1" begin="0s" repeatCount="indefinite"/>
        </circle>
        <circle cx="5" cy="5" r="1.5" fill="#318BFF" opacity="0.8"></circle>
    </svg>
`;

const template = {
    type: 'FeatureCollection',
    features: []
};

const dotsCore = Object.entries(cityJson).map(([name, coord]) => ({
    type: 'Feature',
    properties: {
        className: `dot dot-${coord.log}-${coord.lat}`,
        type: 'symbol',
        types: 'dot',
        scale: 0.1,
        symbol: {
            src: blinkingDot
        }
    },
    geometry: {
        coordinates: [coord.log, coord.lat],
        type: 'Point'
    }
}));

export const dots = {
    ...template,
    features: [...dotsCore]
};
