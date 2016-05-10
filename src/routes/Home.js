class Home {
  route(req, res) {
    res.json({
      ok: 1,
      msg: 'Welcome to thumbiser'
    });
  }
}

export default Home;
