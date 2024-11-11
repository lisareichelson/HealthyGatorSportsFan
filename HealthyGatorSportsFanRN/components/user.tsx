
class User {
    // Class members (properties and methods) go here
    userId: number;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    birthDate: string; //A string is used to define the date here so it can be inside a navigation state
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

    goalType?: string;


    constructor(userId: number, email: string, password: string, fName: string, lName: string, bDate: string, gender: string, hFeet: number, hInches: number, cWeight: number, feelBetter:Boolean, loseWeight: Boolean, goalWeight?: number, goalType?: string) {
        this.userId = userId;
        this.email = email;
        this.password = password;
        this.firstName = fName;
        this.lastName = lName;
        this.birthDate = bDate;
        this.gender = gender;
        this.heightFeet = hFeet;
        this.heightInches = hInches;
        this.currentWeight = cWeight;
        this.feelBetter = feelBetter;
        this.loseWeight = loseWeight;
        this.goalWeight = goalWeight;

        this.goal_to_feel_better = false;
        this.goal_to_lose_weight = false;

        this.goalType = goalType;
    }
}

export default User;