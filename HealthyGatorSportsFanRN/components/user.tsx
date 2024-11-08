
class User {
    // Class members (properties and methods) go here
    userId: number;

    firstName: string;
    lastName: string;
    birthDate: string; //A string is used to define the date here so it can be inside a navigation state

    email: string;

    gender: string;
    heightFeet: number;
    heightInches: number;
    currentWeight: number;

    //Goal-Related Data
    feelBetter: Boolean;
    loseWeight: Boolean;
    goalWeight?: number;

    goal_to_feel_better: boolean;
    goal_to_lose_weight: boolean;


    constructor(userId: number, fName: string, lName: string, bDate: string, email: string, username: string, gender: string, hFeet: number, hInches: number, cWeight: number, feelBetter:Boolean, loseWeight: Boolean, goalWeight?: number) {
        this.userId = userId;
        this.firstName = fName;
        this.lastName = lName;
        this.birthDate = bDate;
        this.email = email;
        this.gender = gender;
        this.heightFeet = hFeet;
        this.heightInches = hInches;
        this.currentWeight = cWeight;
        this.feelBetter = feelBetter;
        this.loseWeight = loseWeight;
        this.goalWeight = goalWeight;

        this.goal_to_feel_better = false;
        this.goal_to_lose_weight = false;
    }
}

export default User;