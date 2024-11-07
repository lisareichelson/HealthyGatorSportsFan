interface Image {
    name: string;
    image: any;
}

export class TeamLogo {
    private static images: Array<Image> = [
        {
            name: 'fsu.png',
            image: require('../assets/images/teamLogos/fsu.png'),
        },
    ];

    static GetImage = (name: string) => {
        const found = TeamLogo.images.find(e => e.name === name);
        return found ? found.image : null;
    };
}