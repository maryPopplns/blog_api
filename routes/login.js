const path = require('path');
const router = express.Router();
const { login_local_post } = require(path.join(
  __dirname,
  '../controllers/login'
));

router.post('/local', login_local_post);

module.exports = router;
