
class User {
    // Class members (properties and methods) go here
    firstName?: string;
    lastName?: string;

    email?: string;

    gender?: string;

    heightFeet?: number;
    heightInches?: number;

    currentWeight?: number;


    constructor(fName?: string, lName?: string, email?: string, gender?: string, hFeet?: number, hInches?: number, cWeight?: number) {
        this.firstName = fName;
        this.lastName = lName;
        this.email = email;
        this.gender = gender;
        this.heightFeet = hFeet;
        this.heightInches = hInches;
        this.currentWeight = cWeight;
    }
}

export default User;