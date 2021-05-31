const {products} = require('../../models/products');
const {User, generateAuthToken} = require('../../models/users');
const request = require('supertest');

describe('auth middleware', () => {
  beforeEach(() => { server = require('../../index'); })
  afterEach(async () => { 
    await products.remove({});
    await server.close(); 
  });

  let token; 
  const productBody = {
    name: "Product x",
    price: 100,
    numberInStock: 2
  };
  const exec = () => {
    return request(server)
      .post('/api/products')
      .set('x-auth-token', token)
      .send(productBody);
  }

  beforeEach(() => {
    token = generateAuthToken({ email: "johndoe@example.com"});
  });

  it('should return 401 if no token is provided', async () => {
    token = ''; 

    const res = await exec();

    expect(res.status).toBe(401);
  });

  it('should return 400 if token is invalid', async () => {
    token = 'a'; 

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('should return 200 if token is valid', async () => {
    const res = await exec();
// console.log(res)
    expect(res.status).toBe(200);
  });
});