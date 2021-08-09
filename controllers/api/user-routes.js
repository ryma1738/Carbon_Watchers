const router = require('express').Router();
const {User, userCarbon} = require('../../models');

router.post('/signup', (req, res) => {
    User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    })
      .then(dbUserData => {
        req.session.save(() => {
          req.session.user_id = dbUserData.id;
          req.session.username = dbUserData.username;
          req.session.loggedIn = true;
    
          res.json({id: dbUserData.id});
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

  router.post('/login', (req, res) => {
    User.findOne({
      where: {
        email: req.body.email
      }
    }).then(dbUserData => {
      if (!dbUserData) {
        res.status(400).json({ message: 'No user with that email address!' });
        return;
      }
  
      const validPassword = dbUserData.checkPassword(req.body.password);
  
      if (!validPassword) {
        res.status(400).json({ message: 'Incorrect password!' });
        return;
      }
  
      req.session.save(() => {
        req.session.user_id = dbUserData.id;
        req.session.username = dbUserData.userName;
        req.session.loggedIn = true;
    
        res.json({ id: dbUserData.id});
      });
    }).catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
  });


  router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
      req.session.destroy(() => {
        res.status(204).end();
      });
    }
    else {
      res.status(404).end();
    }
  });

  router.get('/carbon', (req, res) => {
    // query: ?id=1
    userCarbon.findOne({
      where: {
        user_id: req.query.id
      }
    }).then(dbCarbonData => {
      if (!dbCarbonData) {
        res.status(200).json({message: 'No User Carbon Data found! Please fill out the Carbon Foot Print form found on the account page!'})
      } else {
        res.status(200).json(dbCarbonData);
      }
    }).catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
  });

  router.post('/carbon', (req, res) => {
    userCarbon.create({
      totalCarbonLbs: req.body.totalLbs,
      totalCarbonMt: req.body.totalMt,
      carbonSecLbs: req.body.carbonSecLbs,
      carbonSecMt: req.body.carbonSecMt,
      carbonMsLbs: req.body.carbonMsLbs,
      carbonMsMt: req.body.carbonMsMt,
      user_id: req.body.id
    }).then(() => {
      res.status(204);
    }).catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
  });

  router.put('/carbon/:id', (req, res) => {
    //update users carbon info
  });


  router.put('/:id', (req, res) => {
 
    // pass in req.body instead to only update what's passed through
    User.update(req.body, {
      individualHooks: true,
      where: {
        id: req.params.id
      }
    })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });





module.exports = router;