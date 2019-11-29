const chai = require('chai'),
    chaiHttp = require('chai-http'),
    server = require('../app'),
    should = chai.should();
let assert = require('assert');

    chai.use(chaiHttp);
let base_url = '/api';

let user = {
    first_name: 'Test',
    last_name: 'Test',
    email: 'test2@test.com',
    password: 'test001'
}

let token = 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNWRlMDMwZDBlODk5YTEzMDljZjVhZDBkIiwibGV2ZWwiOjcsImlhdCI6MTU3NDk3NzE0OSwiZXhwIjoxNTc0OTgwNzQ5LCJhdWQiOiJNeSBPcmciLCJpc3MiOiJNeSBPcmciLCJzdWIiOiJNeSBPcmcifQ.Wi_M3gnqE5FL1Ybe2NWhYDszx-DaHowl3anGhJwynpM4KrxNUMdRDNGuoXG4F4k8xYJW9lGL8NK8wiXzm3X9SeQGte6RdNvmLwswvmTbem9jjyxvGnALS05x5SczRie0-kuDNh8KDsnvI9D2VAkGtVTTG8jOY0OCagsdr_mpHU0'

describe('USER functions', () => {
    xit('should create user', (done) => {
        chai.request(server)
            .post(base_url + '/new/user')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('Object');
                res.body.should.have.property('user');
                res.body.user.should.have.property('first_name');
                done();
            })
    })

    let user_activate = {
        "action": "Activate",
        "_id": "5de030d0e899a1309cf5ad0d"
    }

    it('should activate user', (done) => {
        chai.request(server)
            .post(base_url + '/activate/user')
            .set('authorization', token)
            .send(user_activate)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                // console.log(res.body, 'Activate')
                res.body.should.be.a('Object');
                should.not.exist(res.body.error.message);
                done();
            })
    })

    xit('should verify user', (done) => {
        chai.request(server)
            .post(base_url + '/auth/login')
            .send(user)
            .end((err, res) => {
                // console.log(res.body)
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('Object');
                res.body.should.have.property('user');
                res.body.user.should.have.property('first_name');
                done();
            })
    })

    let user_edited = {
        "first_name": "Test",
        "last_name": "Test",
        "level": 7,
        "_id": "5de030d0e899a1309cf5ad0d"
    }

    it('should edit user', (done) => {
        chai.request(server)
            .post(base_url + '/edit/user')
            .set('authorization', token)
            .send(user_edited)
            .end((err, res) => {
                res.should.have.status(200);
                // console.log(res.body)
                res.should.be.json;
                res.body.should.be.a('Object');
                res.body.should.have.property('user');
                res.body.user.should.have.property('first_name');
                done();
            })
    })

    it('should get user', (done) => {
        chai.request(server)
            .post(base_url + '/get/user')
            .set('authorization', token)
            .send(user_edited)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('Object');
                res.body.should.have.property('user');
                res.body.user.should.have.property('first_name');
                done();
            })
    })

    it('should get users', (done) => {
        chai.request(server)
            .post(base_url + '/get/users')
            .set('authorization', token)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('Object');
                res.body.should.have.property('users');
                res.body.users.should.be.a('Array');
                res.body.users[0].should.be.a('Object');
                res.body.users[0].should.have.property('first_name');
                done();
            })
    })

})

describe('Auth', () => {
    xit('should verify user', (done) => {
        chai.request(server)
            .post(base_url + '/auth/login')
            .send(user)
            .end((err, res) => {
                // console.log(res.body)
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('Object');
                res.body.should.have.property('user');
                res.body.user.should.have.property('first_name');
                done();
            })
    })

    let user_new_pass = {
        "action": "Activate",
        "_id": "5de030d0e899a1309cf5ad0d",
        "cur_password": "test002",
        "email": "test2@test.com",
        "new_password": "test001"
    }

    xit('should change user password', (done) => {
        chai.request(server)
            .post(base_url + '/auth/change/password')
            .send(user_new_pass)
            .end((err, res) => {
                // console.log(res.body)
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('Object');
                should.not.exist(res.body.error.message);
                done();
            })
    })

    xit('should request otp', (done) => {
        chai.request(server)
            .post(base_url + '/auth/request/otp')
            .send(user_new_pass)
            .end((err, res) => {
                // console.log(res.body)
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('Object');
                should.not.exist(res.body.error.message);
                done();
            })
    })

    let user_complete_otp_det = {
        "email": "test2@test.com",
        "_id": "5de030d0e899a1309cf5ad0d",
        "token": "CzR4uhEH8tHHht1Amrw1hu",
        "password": "test001"
    };

    it('should complete otp request', (done) => {
        chai.request(server)
            .post(base_url + '/auth/complete/otp')
            .send(user_complete_otp_det)
            .end((err, res) => {
                // console.log(res.body)
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('Object');
                should.not.exist(res.body.error.message);
                done();
            })
    })
});


let team_data = {

};

user = {
    first_name: 'Test3',
    last_name: 'Test3',
    email: 'test3@test.com',
    password: 'test003'
};


describe('TEAM ROUTES', async () => {
    await xit('should create user', (done) => {
        chai.request(server)
            .post(base_url + '/new/user')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                // console.log(res.body)
                res.should.be.json;
                res.body.should.be.a('Object');
                res.body.should.have.property('user');
                res.body.user.should.have.property('first_name');
                done()
            })
    })
    let members = []
    await xit('should get users', (done) => {
        chai.request(server)
            .post(base_url + '/get/users')
            .set('authorization', token)
            .end((err, res) => {
                res.should.have.status(200);
                // console.log(res.body)
                res.should.be.json;
                res.body.should.be.a('Object');
                res.body.should.have.property('users');
                res.body.users.should.be.a('Array');
                res.body.users[0].should.be.a('Object');
                res.body.users[0].should.have.property('first_name');
                for (let i = 0; i < res.body.users.length; i++) {
                    members.push(res.body.users[i]._id)
                    if(i === res.body.users.length -1)
                        done()
                }
            })
    })
   await xit('should create new team', (done) => {
       team_data = {
           name: 'Falconers',
           description: 'Counter force infantry team',
           members,
           level: 4
       };
        // console.log(team_data)
       chai.request(server)
           .post(base_url + '/new/team')
           .set('authorization', token)
           .send(team_data)
           .end((err, res) => {
               res.should.have.status(200);
               res.should.be.json;
               res.body.should.be.a('Object');
               res.body.should.have.property('team');
               res.body.team.should.have.property('name');
               done()
           })
   })
    let team = {
        "_id": ""
    }
    await it('should get teams', (done) => {
        // console.log(team_data)
       chai.request(server)
           .post(base_url + '/new/team')
           .set('authorization', token)
           .send(team_data)
           .end((err, res) => {
               res.should.have.status(200);
               res.should.be.json;
               res.body.should.be.a('Object');
               res.body.should.have.property('teams');
               res.body.team[0].should.have.property('name');
               team._id = res.body.team[0]._id;
               done()
           })
   })

    await it('should get team', (done) => {
        // console.log(team_data)
       chai.request(server)
           .post(base_url + '/new/team')
           .set('authorization', token)
           .send({_id: team._id})
           .end((err, res) => {
               res.should.have.status(200);
               res.should.be.json;
               res.body.should.be.a('Object');
               res.body.should.have.property('team');
               res.body.team.should.have.property('name');
               done()
           })
   })
});
