const request = require('supertest');
const {products} = require('../../models/products');
const {Users, generateAuthToken} = require('../../models/users');
const mongoose = require('mongoose');

let server;

describe('/api/products', () => {
  beforeEach(() => { server = require('../../index'); })
  afterEach(async () => { 
    await server.close(); 
    await products.deleteMany({});
  });

  const productBody = [{
    name: "Product x",
    price: 20,
    numberInStock: 2
  },{
    name: "Product z",
    price: 100,
    numberInStock: 2
  }];
  let token; 
  beforeEach(() => {
    // token = generateAuthToken({ email: "johndoe@example.com"});
    // const exec = () => {
    //   return request(server)
    //     .post('/api/products')
    //     .set('x-auth-token', token)
    //     .send(productBody);
    // }
  });
  describe('GET /', () => {
    it('should return all products', async () => {
      await products.collection.insertMany(productBody);

      const res = await request(server).get('/api/products');
      
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(p => p.name === 'Product z')).toBeTruthy();
      expect(res.body.some(p => p.name === 'Product x')).toBeTruthy();
    });
  });

  describe('GET /:id', () => {
    it('should return a product if valid id is passed', async () => {
      const product = new products({name: "Product n",
                                    price: 100,
                                    numberInStock: 2
                                  });
      await product.save();

      const res = await request(server).get('/api/products/' + product._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', product.name);     
    });

    it('should return 404 if invalid id is passed', async () => {
      const res = await request(server).get('/api/products/1');

      expect(res.status).toBe(404);
    });

    it('should return 404 if no genre with the given id exists', async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get('/api/products/' + id);

      expect(res.status).toBe(404);
    });
  });

  describe('POST /', () => {

    let token; 
    const productBody = {
      name: "Product x",
      price: 100,
      numberInStock: 2
    };
  
    const exec = async () => {
      return await request(server)
        .post('/api/products')
        .set('x-auth-token', token)
        .send(productBody);
    }

    beforeEach(() => {
      token = generateAuthToken({ email: "johndoe@example.com"});      
      productBody.name = 'Product m'; 
    })

    it('should return 401 if client is not logged in', async () => {
      token = ''; 

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 400 if product is less than 5 characters', async () => {
      productBody.name = '1234'; 
      
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if product is more than 50 characters', async () => {
      productBody.name = new Array(52).join('a');

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should save the product if it is valid', async () => {
      await exec();

      const product = await products.find({
        name: "Product x"
      });

      expect(product).not.toBeNull();
    });

    it('should return the product if it is valid', async () => {
      const res = await exec();
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name');
    });
  });

  describe('PUT /:id', () => {
    let token; 
    let id; 
    const productBody = {
      name: "Product x",
      price: 100,
      numberInStock: 2
    };
    const exec = async () => {
      return await request(server)
        .put('/api/products/' + id)
        .set('x-auth-token', token)
        .send(productBody);
    }
    beforeEach(async () => {
      product = new products(productBody);
      await product.save();
      
      token = generateAuthToken({email: "johndoe@example.com"});     
      id = product._id;
    })
    it('should return 401 if client is not logged in', async () => {
      token = ''; 
      const res = await exec();

      expect(res.status).toBe(401);
    });

    // it('should return 400 if product is less than 5 characters', async () => {
    //   productBody.name = '1234'; 
      
    //   const res = await exec();
      
    //   expect(res.status).toBe(400);
    // });
    
    it('should return 400 if product is more than 50 characters', async () => {
      productBody.name = new Array(52).join('a');
      
      const res = await exec();
      // console.log(res);

      expect(res.status).toBe(400);
    });

    it('should return 400 if id is invalid', async () => {
      id = 1;
      productBody.name = "new name";
      const res = await exec();
      
      expect(res.status).toBe(400);
    });
    
    it('should return 404 if product with the given id was not found', async () => {
      id = mongoose.Types.ObjectId();
      productBody.name = "new name";

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should update the product if input is valid', async () => {
      await exec();

      const updatedProduct = await products.findById(product._id);

      expect(updatedProduct.name).toBe(productBody.name);
    });

    it('should return the updated product if it is valid', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', productBody.name);
    });
  });  

  describe('DELETE /:id', () => {
    let token; 
    let id; 
    const productBody = {
      name: "Product x",
      price: 100,
      numberInStock: 2
    };
    const exec = async () => {
      return await request(server)
        .delete('/api/products/' + id)
        .set('x-auth-token', token)
        .send();
    }

    beforeEach(async () => {
      product = new products(productBody);
      await product.save();
      
      id = product._id; 
      token = generateAuthToken("johndoe@example.com");     
    })

    it('should return 401 if client is not logged in', async () => {
      token = ''; 

      const res = await exec();

      expect(res.status).toBe(401);
    });


    it('should return 400 if id is invalid', async () => {
      id = 1; 
      
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 404 if no product with the given id was found', async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();
      // console.log(res.body);
      expect(res.status).toBe(404);
    });

    it('should delete the product if input is valid', async () => {
      await exec();

      const productInDb = await products.findById(id);

      expect(productInDb).toBeNull();
    });

    it('should return the removed product', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('_id', product._id.toHexString());
      expect(res.body).toHaveProperty('name', product.name);
    });
  });  
});