
class User {
    // Class members (properties and methods) go here
    firstName: string;
    lastName: string;
    birthDate: string; //A string is used to define the date here so it can be inside a navigation state

    email: string;
    username: string;

    gender: string;
    heightFeet: number;
    heightInches: number;
    currentWeight: number;

    //Goal-Related Data
    feelBetter: Boolean;
    loseWeight: Boolean;
    goalWeight?: number;


    constructor(fName: string, lName: string, uName: string, bDate: string, email: string, username: string, gender: string, hFeet: number, hInches: number, cWeight: number, feelBetter:Boolean, loseWeight: Boolean, goalWeight?: number) {
        this.firstName = fName;
        this.lastName = lName;
        this.username = uName;
        this.birthDate = bDate;
        this.email = email;
        this.gender = gender;
        this.heightFeet = hFeet;
        this.heightInches = hInches;
        this.currentWeight = cWeight;
        this.feelBetter = feelBetter;
        this.loseWeight = loseWeight;
        this.goalWeight = goalWeight;
    }
}

export default User;