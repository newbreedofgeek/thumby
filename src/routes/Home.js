class Home {
  route(req, res) {
    res.json({
      env: 'This is Production'
    });
  }
}

export default Home;
