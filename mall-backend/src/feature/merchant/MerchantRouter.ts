import express, { RequestHandler } from 'express';
import { requireAuth } from '@clerk/express';
import { createMerchant, getMerchant, updateMerchant, deleteMerchant, getAllMerchants, getMerchantByUserId, getCurrentUserMerchant } from './MerchantController';

const merchantRouter = express.Router();

merchantRouter.post('/createMerchant', requireAuth(), (createMerchant as unknown) as RequestHandler);
merchantRouter.get('/getMerchant/:merchantId', (getMerchant as unknown) as RequestHandler);
/**
 * 后续需要添加权限验证，然后保证用户安全，不要把userId,merchantId暴露出去
 */
merchantRouter.get('/getMerchantByUserId/:userId', (getMerchantByUserId as unknown) as RequestHandler);
merchantRouter.get('/getCurrentUserMerchant', requireAuth(), (getCurrentUserMerchant as unknown) as RequestHandler);
merchantRouter.put('/updateMerchant/:merchantId', requireAuth(), (updateMerchant as unknown) as RequestHandler);
merchantRouter.delete('/deleteMerchant/:merchantId', requireAuth(), (deleteMerchant as unknown) as RequestHandler);
merchantRouter.get('/allMerchants', (getAllMerchants as unknown) as RequestHandler);

export default merchantRouter;