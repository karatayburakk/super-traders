import User from "./models/user";
import Share from "./models/share";
import { shares, users } from "./pre-data";

export async function initializeDatabaseWithData() {
  try {
    await User.bulkCreate(users);
    await Share.bulkCreate(shares);
  } catch (err) {
    console.error("Error while Inserting Data to Database");
  }
}
