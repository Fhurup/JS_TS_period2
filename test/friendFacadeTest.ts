import * as mongo from "mongodb"
import FriendFacade from '../src/facades/friendFacade';

import chai from "chai";
const expect = chai.expect;

//use these two lines for more streamlined tests of promise operations
import chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);

import bcryptjs from "bcryptjs"
import { InMemoryDbConnector } from "../src/config/dbConnector"
import { ApiError } from "../src/errors/errors";

let friendCollection: mongo.Collection;
let facade: FriendFacade;

describe("## Verify the Friends Facade ##", () => {

  before(async function () {
    const client = await InMemoryDbConnector.connect();
    const db = client.db();
    friendCollection = db.collection("friends");
    facade = new FriendFacade(db);
  })

  beforeEach(async () => {
    const hashedPW = await bcryptjs.hash("secret", 4)
    await friendCollection.deleteMany({})
    await friendCollection.insertMany([
        { firstName: "Donald", lastName: "Duck", email: "dd@b.dk", password: hashedPW, role: "user" },
        { firstName: "Peter", lastName: "Admin", email: "peter@admin.dk", password: hashedPW, role: "admin" },
      ])
  })

  describe("Verify the addFriend method", () => {
    it("It should Add the user Jan", async () => {
      const newFriend = { firstName: "Jan", lastName: "Olsen", email: "jan@b.dk", password: "secret" }
      const status = await facade.addFriend(newFriend);
      expect(status).to.be.not.null
      const jan = await friendCollection.findOne({ email: "jan@b.dk" })
      expect(jan.firstName).to.be.equal("Jan")
    })

    it("It should not add a user with a role (validation fails)", async () => {
      const newFriend = { firstName: "Jan", lastName: "Olsen", email: "jan@b.dk", password: "secret", role: "admin" }
      await expect(facade.addFriend(newFriend)).to.be.rejectedWith(ApiError)
    })
  })

  describe("Verify the editFriend method", () => {
    it("It should change lastName to XXXX", async () => {
    const newName = { firstName: "Donald", lastName: "XXXX", email: "dd@b.dk", password: "hashedPW"}
    const status = await facade.editFriend(newName.email, newName);
    expect(status.modifiedCount).to.equal(1)
    const editedFriend = await friendCollection.findOne({email : newName.email})
    expect(editedFriend.lastName).to.equal(newName.lastName)

    })
  })

  describe("Verify the deleteFriend method", () => {
    it("It should remove the user Donald", async () => {
    const deleted = await facade.deleteFriend("dd@b.dk")
    expect(deleted).to.equal(true);
    const all = await friendCollection.find({}).toArray();
    expect(all.length).to.equal(1);
    })
    it("It should return false, for a user that does not exist", async () => {
    const deleted = await facade.deleteFriend("xxx")
    expect(deleted).to.equal(false);
    const all = await friendCollection.find({}).toArray();
    expect(all.length).to.equal(2);
    })
  })

  describe("Verify the getAllFriends method", () => {
    it("It should get two friends", async () => {
    const all = await facade.getAllFriends();
    expect(all.length).to.equal(2)
    })
  })

  describe("Verify the getFriend method", () => {

    it("It should find Donald Duck", async () => {
    const donald = await facade.getFrind("dd@b.dk")
    expect(donald.email).to.equal("dd@b.dk")
    })
    it("It should not find xxx.@.b.dk", async () => {
    await expect(facade.getFrind("XXXX")).to.be.rejectedWith(ApiError)
    })
  })

  describe("Verify the getVerifiedUser method", () => {
    it("It should correctly validate Peter Pan's credential,s", async () => {
      const veriefiedPeter = await facade.getVerifiedUser("peter@admin.dk", "secret")
      expect(veriefiedPeter).to.be.not.null;
    })

    it("It should NOT validate Peter Pan's credential,s", async () => {
    const notVeri = await facade.getVerifiedUser("peter@admin.dk", "fisk")
    expect(notVeri).to.be.null;
    })
    it("It should NOT validate a non-existing users credentials", async () => {
    const notVeriAllWrong = await facade.getVerifiedUser("Forkert", "osForkert")
    expect(notVeriAllWrong).to.be.null;
    })
  })

})