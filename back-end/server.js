import express from "express";
import newsRouter from './routes/news/news.js';
import usersRouter from './routes/users/users.js';
import queriesRouter from './routes/queries/queries.js';
import { accessLogMiddleware } from './logs/accessLog.js';
import adminRouter from './routes/admin/admin.js';

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(accessLogMiddleware); // Apply access logging middleware

app.use('/news', newsRouter);
app.use('/users', usersRouter);
app.use('/queries', queriesRouter);
app.use('/admin', adminRouter);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
