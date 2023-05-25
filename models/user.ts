import {Model, Schema, model, models} from 'mongoose';
import { unique } from 'next/dist/build/utils';
import { User } from '@globalTypes/types';

const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

interface UserMethods {
    comparePassword: (candidatePassword: string, cb: (err: Error, isMatch: boolean) => void) => void;
}

type UserModel = Model<User, {}, UserMethods>;


const UserSchema = new Schema<User, UserModel, UserMethods>({
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required'],
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        match: [/^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/, "Username invalid, it should contain 8-20 alphanumeric letters and be unique!"],
        unique: true,
    },
    image: {
        type: String,
    },
    password: {
        type: String,
        match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, "Password invalid, it should contain at least 8 characters, one uppercase letter, one lowercase letter and one number!"],
    },
});

UserSchema.pre('save', function (next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err: Error, salt: string) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function (err: Error, hash: string) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function (candidatePassword: string, cb: any) {
    bcrypt.compare(candidatePassword, this.password, function (err: Error, isMatch: boolean) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

const UserModel = models.User || model('User', UserSchema);

export default UserModel;

