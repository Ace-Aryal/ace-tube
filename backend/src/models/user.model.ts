import mongoose, {
  CallbackWithoutResultAndOptionalError,
  DefaultSchemaOptions,
  Document,
  Schema,
  Types,
} from "mongoose";
import bcrypt from "bcryptjs";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import jwt from "jsonwebtoken";
export interface IUser extends Document {
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  coverImage?: string;
  watchHistory: Types.ObjectId[];
  password: string;
  refreshToken?: string;
}
const userSchema: Schema<IUser> = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
    },
    //   relation in mongoose
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      // we can use this format too for any true statements
      required: [true, "Password is required"],
      select: false,
    },
    refreshToken: {
      // refresh token is long long string and ntg more
      type: String,
    },
  },
  { timestamps: true }
);
userSchema.plugin(mongooseAggregatePaginate);
userSchema.pre("save", async function (this: IUser) {
  // note: no need to call next in new version
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});
userSchema.methods.isPasswordMatched = async function (
  this: IUser,
  givenPassword: string
): Promise<boolean> {
  const isMatched = await bcrypt.compare(givenPassword, this.password);
  return isMatched;
};

userSchema.methods.generateAccessToken = function (this: IUser) {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullName: this.fullName,
      username: this.username,
      avatar: this.avatar,
    },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: "15m" }
  );
};
userSchema.methods.generateRefreshToken = function (this: IUser) {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: "10d" }
  );
};

// the name you are giving here "User" is then referenced in another file
export const UserModal = mongoose.model("User", userSchema);
