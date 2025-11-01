import express from 'express';
// 'default' import 대신 'named' export들을 'ctrlLocations' 객체로 묶어서 가져옵니다.
import * as ctrlLocations from '../controllers/locations.js';
// 'others.js' 파일도 동일하게 수정합니다.
import * as ctrlOthers from '../controllers/others.js';

const router = express.Router();

/* Locations pages */
router.get('/', ctrlLocations.homelist);
router.get('/location/:locationid', ctrlLocations.locationInfo);
router
  .route('/location/:locationid/review/new')
  .get(ctrlLocations.addReview)
  .post(ctrlLocations.doAddReview);

/* Other pages */
router.get('/about', ctrlOthers.about);

// router 객체 자체는 default로 내보내는 것이 맞습니다.
export default router;