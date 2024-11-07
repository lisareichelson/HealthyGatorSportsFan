/*
This file is used to manage dynamic image loading for opposing teams.
Ensure to load all possible opponents into this file
 */

interface Image {
    name: string;
    image: any;
}

export class TeamLogo {
    private static images: Array<Image> = [
        {
            name: 'fsu', //florida state university
            image: require('../assets/images/teamLogos/fsu.png'),
        },
        {
            name: 'uga', //university of georgia
            image: require('../assets/images/teamLogos/uga.png'),
        },
        {
            name: 'lsu', //louisiana state university
            image: require('../assets/images/teamLogos/lsu.png'),
        },
        {
            name: 'uk', //university of kentucky
            image: require('../assets/images/teamLogos/uk.png'),
        },
        {
            name: 'uv', //university of vanderbilt
            image: require('../assets/images/teamLogos/uv.png'),
        },
        {
            name: 'utk', //university of tennessee knoxville
            image: require('../assets/images/teamLogos/utk.jpg'),
        },
        {
            name: 'usc', //university of south carolina
            image: require('../assets/images/teamLogos/usc.png'),
        },
        {
            name: 'mu', //university of Missouri
            image: require('../assets/images/teamLogos/mu.png'),
        },
        {
            name: 'a&m', //texas A & M
            image: require('../assets/images/teamLogos/a&m.png'),
        },
    ];

    static GetImage = (name: string) => {
        const found = TeamLogo.images.find(e => e.name === name);
        return found ? found.image : null;
    };
}