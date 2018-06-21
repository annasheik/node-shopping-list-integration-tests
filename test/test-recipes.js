const chai = require('chai');
const chaiHttp = require('chai-http');
const {app, runServer, closeServer} = require('../server');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Recipes', function() {
	before(function() {
		return runServer();
	});

	after(function() {
		return closeServer();
	});

	//GET test
	//1. Make req to '/recipes'
	//2. Inspect res object to have right status code, and right keys in res object.
	it('should list items on GET', function() {
		return chai.request(app)
		.get('/recipes')
		.then(function(res) {
			expect(res).to.have.status(200);
			expect(res).to.be.json;
			expect(res.body).to.be.a('array');
			expect(res.body.length).to.be.at.least(1);
			const expectedKeys = ['name', 'id', 'ingredients'];
			res.body.forEach(function(item) {
				expect(item).to.be.a('object');
				expect(item).to.include.keys(expectedKeys);
			});
		});
	});

	//PUT test
	//1.Initialize some update data(no id yet)
	//2. Create GET req so we can get item to update
	//3. Add id to updateData
	//4. Make PUT req with updateData
	//5.Inspect res obj to have right status code 204
	it('should update items on PUT', function() {
		const updateData2 = {
			name: 'Salad',
			ingredients: ['salad', 'dressing']
		};
		return chai.request(app)
		.get('/recipes')
		.then(function(res) {
			updateData2.id = res.body[0].id;
			return chai.request(app)
			.put(`/recipes/${updateData2.id}`)
			.send(updateData2)
		})
		.then(function(res) {
			expect(res).to.have.status(204);
			
		});
	});

	//POST test
	//1.make POST req with data for new item
	//2. Inspect res object to have right status code and id
	it('should add a new item on POST', function() {
		const newItem = {
			name: 'Coffee',
			ingredients: ['coffee', 'water', 'milk']
		};
		return chai.request(app)
		.post('/recipes')
		.send(newItem)
		.then(function(res) {
			expect(res).to.have.status(201);
			expect(res).to.be.json;
			expect(res.body).to.be.a('object');
			expect(res.body).to.include.keys('id', 'name', 'ingredients');
			expect(res.body.ingredients).to.be.a('array');
			expect(res.body.ingredients).to.include.members(newItem.ingredients)
		});
	});

	//DELETE test
	//GET recipes list so we can get ID of 1
	// delete item and ensure we get back status 204
	it('should delete item on DELETE', function() {
		return chai.request(app)
		.get('/recipes')
		.then(function(res) {
			return chai.request(app)
			.delete(`/recipes/${res.body[0].id}`)
		});
		then(function(res) {
			expect(res).to.have.status(204);
		});
	});

});