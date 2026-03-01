function bootstrap(app) {
  
  app.use("/{*any}", (req, res) => {
    res.status(404).json({ message: "this Router is not found" })
  })
}

export default bootstrap;