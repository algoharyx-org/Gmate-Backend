import authRouter from "./modules/auth/auth.route.js";

function bootstrap(app) {
  app.use('/auth', authRouter);

  app.use('/{*any}', (req, res) => {
    res.status(404).json({ message: 'this Router is not found' });
  });
}

export default bootstrap;
