import { Router } from 'express';
import * as commentController from './comment.controller.js';
// تعديل الاستيراد ليتناسب مع الـ export default والاسم الكبير V
import Validate from '../../middlewares/validate.js'; 
import { authentication } from '../../middlewares/authentication.js';
import * as commentValidator from './comment.validator.js';

const commentRouter = Router();

// 1. إنشاء كومنت
commentRouter.post('/', 
    authentication, 
    Validate(commentValidator.addCommentSchema), // استخدمنا الاسم الجديد هنا
    commentController.addComment
);

// 2. جلب كل الكومنتات الخاصة بتاسك معينة
commentRouter.get('/:taskId', 
    Validate(commentValidator.getCommentsSchema), 
    commentController.getComments
);

// 3. جلب كومنت واحد محدد
commentRouter.get('/one/:commentId', 
    Validate(commentValidator.getOneCommentSchema), 
    commentController.getCommentById
);

// 4. تعديل كومنت
commentRouter.put('/:commentId', 
    authentication, 
    Validate(commentValidator.updateCommentSchema), 
    commentController.updateComment
);

// 5. حذف كومنت
commentRouter.delete('/:commentId',
    authentication,
    Validate(commentValidator.getOneCommentSchema), 
    commentController.deleteComment
);

export default commentRouter;