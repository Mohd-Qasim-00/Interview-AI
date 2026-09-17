const express=require('express');
const cookieParser=require('cookie-parser');

const cors=require('cors');

const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const authRouter=require('./routes/auth.route')

const interviewRouter=require('./routes/interview.routes');

const app=express();
app.use(cookieParser());

app.use((req, res, next) => {
  console.log("REQUEST:", req.method, req.url,req.body, req.headers);
  next();
});
app.use(cors({
  origin: "interview-ai-kappa-dun.vercel.app",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],

}));
app.use(express.json());

app.use('/api/auth',authRouter);

app.use('/api/interview',interviewRouter);

module.exports=app;