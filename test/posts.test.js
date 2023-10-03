const chaiHttp = require('chai-http');
const app = require('../src/server'); 
const mongoose = require('mongoose');
const chai = require('chai');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Blog Post Routes', () => {
  before((done) => {
    // Connect to a test database before running tests
    mongoose
      .connect('mongodb+srv://irfanmi991899:miirfan@cluster0.tegumqw.mongodb.net/?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log('Connected to test database');
        done();
      })
      .catch((error) => {
        console.error('Error connecting to test database:', error);
        done(error);
      });
  });

  after((done) => {
    // Disconnect and close the test database connection after all tests
    mongoose.connection
      .close()
      .then(() => {
        console.log('Closed test database connection');
        done();
      })
      .catch((error) => {
        console.error('Error closing test database connection:', error);
        done(error);
      });
  });

  beforeEach((done) => {
    // Clear the database before each test
    mongoose.connection.dropDatabase().then(() => {
      done();
    });
  });

  // Test GET /api/posts
  describe('GET /api/posts', () => {
    it('should retrieve a list of all blog posts', (done) => {
      chai
        .request(app)
        .get('/api/posts')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          done();
        });
    });
  });

  // Test GET /api/posts/:id
  describe('GET /api/posts/:id', () => {
    it('should retrieve a specific blog post by its ID', (done) => {
      
      const postId = '651ba36dd2cdd82a6b25f78b';
      chai
        .request(app)
        .get(`/api/posts/${postId}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('_id', postId);
          done();
        });
    });
  });

// Test POST /api/posts/create
describe('POST /api/posts/create', () => {
    it('should create a new blog post', (done) => {
      const newPost = {
        title: 'New Post Title',
        content: 'New Post Content',
        category_id: '5f59e6a93741c8e7e97ab0b3',
      };
  
      chai
        .request(app)
        .post('/api/posts/create')
        .send(newPost)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('_id');
          expect(res.body).to.have.property('title', newPost.title);
          expect(res.body).to.have.property('content', newPost.content);
          done();
        });
    });
  });
  
  // Test PUT /api/posts/update/:id
  describe('PUT /api/posts/update/:id', () => {
    it('should update an existing blog post by its ID', (done) => {
      const updatedPostData = {
        title: 'Updated Title',
        content: 'Updated Content',
      };
  
      const postId = '651ba4d9d2cdd82a6b25f78e';
  
      chai
        .request(app)
        .put(`/api/posts/update/${postId}`)
        .send(updatedPostData)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('title', updatedPostData.title);
          expect(res.body).to.have.property('content', updatedPostData.content);
          done();
        });
    });
  });
  
  // Test DELETE /api/posts/remove/:id
  describe('DELETE /api/posts/remove/:id', () => {
    it('should delete a blog post by its ID', (done) => {
     
      const postId = '651ba4d9d2cdd82a6b25f78e';
  
      chai
        .request(app)
        .delete(`/api/posts/remove/${postId}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message', 'Post deleted successfully');
          done();
        });
    });
  });
  
  // Test GET /api/posts/latest
  describe('GET /api/posts/latest', () => {
    it('should retrieve the latest blog post from each unique category', (done) => {
      chai
        .request(app)
        .get('/api/posts/latest')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');         
          done();
        });
    });
  });
  

});
