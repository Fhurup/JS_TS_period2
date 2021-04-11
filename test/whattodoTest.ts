const expect = require("chai").expect;
import app from "../playground/what/whattodo";
const request = require("supertest")(app);
import nock from "nock";

describe("What to do endpoint", function () {
  before(() => { 
      nock('https://www.boredapi.com')
      .get("/api/activity")
      .reply(200, {"activity":"drink a single beer","type":"recreational","participants":1,"price":0.1,"link":"","key":"8503795","accessibility":0.2})
   })

  it("Should eventually provide 'drink a single beer'", async function () {
    const response = await request.get("/whattodo")
    expect(response.body.activity).to.be.equal("drink a single beer");
  })

describe("Info frederik", function (){
  before(() => { 
    nock('https://api.genderize.io')
    .get("/?name=Frederik")
    .reply(200, {"name":"frederik","gender":"male","probability":0.99,"count":4045})
    })
    before(() => { 
    nock("https://api.nationalize.io")
    .get("/?name=Frederik")
    .reply(200, {"name":"frederik","country":{"country_id":"DK","probability":0.675413471416494}})
    })
    before(() => { 
    nock("https://api.agify.io")
    .get("/?name=Frederik")
    .reply(200, {"name":"frederik","age":29,"count":3593})
 })
 it("Should eventually provide 'drink a single beer'", async function () {
  const response = await request.get("/nameinfo/Frederik")
  expect(response.body.gender).to.be.equal("male");
  expect(response.body.country).to.be.equal("DK");
  expect(response.body.age).to.be.equal(29);
})
})
})

describe("What to do endpoint", function () {
  before(() => { 
      nock('https://www.boredapi.com')
      .get("/api/activity")
      .reply(200, {"activity":"drink a single beer","type":"recreational","participants":1,"price":0.1,"link":"","key":"8503795","accessibility":0.2})
   })

  it("Should eventually provide 'drink a single beer'", async function () {
    const response = await request.get("/whattodo")
    expect(response.body.activity).to.be.equal("drink a single beer");
  })

  describe("Nameinfo endpoint", function () {
    before(() => {
        nock('https://api.genderize.io?')
        .get("/?name=christian")
        .reply(200, { "name":"christian","gender":"male","probability":0.99,"count":4045});      
      })
    before(() => {
      nock('https://api.nationalize.io?')
      .get("/?name=christian")
      .reply(200, {"name":"christian","country":[{"country_id":"CD","probability":0.06884214783411641},{"country_id":"AT","probability":0.061064276092235054},{"country_id":"DE","probability":0.052422628374359015}]})
      })
    before(() => {
      nock('https://api.agify.io?')
        .get("/?name=christian")
        .reply(200, {"name":"christian","age":57,"count":145059})
    })
  
    it("Should eventually provide 'male', 'CD, '57", async function () {
      const response = await request.get("/nameinfo/christian")
      expect(response.body.gender).to.be.equal("male");
      expect(response.body.country).to.be.equal("CD");
      expect(response.body.age).to.be.equal(57);
    })
  })

})