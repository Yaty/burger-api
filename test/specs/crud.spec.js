const crud = require('../../src/controllers/Menu');
const productCrud = require('../../src/controllers/Product');
const {uuid} = require('../utils');
const {expect} = require('chai');

describe('CRUD Spec', () => {
    const testData = {
        name: uuid(),
    };

    let productId;

    before(async () => {
        const product = await productCrud.create({name: uuid(), price: uuid()});
        productId = product.id;

        const {id} = await crud.create({...testData, productIds: [productId]});
        testData.id = id;
    });

    after(async () => {
        await productCrud.destroyById(productId);
        await crud.destroyById(testData.id);
    });

    describe('count', () => {
        it('should count properly', async () => {
            const count = await crud.count();
            expect(count).to.be.finite;
            expect(count).to.be.above(0);
        });
    });

    describe('create', () => {
        const data = {
            name: uuid(),
        };

        it('should create properly', async () => {
            const res = await crud.create(data);
            data.id = res.id;
            expect(res).to.be.an('object');
            expect(res).to.deep.equal(data);
        });

        after(async () => {
            await crud.destroyById(data.id);
        });
    });

    describe('destroyById', () => {
        const data = {
            name: uuid(),
        };

        before(async () => {
            const res = await crud.create(data);
            data.id = res.id;
        });

        it('should destroy properly', async () => {
            const res = await crud.destroyById(data.id);
            expect(res).to.be.equal(true);
        });
    });

    describe('exists', () => {
        it('should exists', async () => {
            const res = await crud.exists({where: testData});
            expect(res).to.be.equal(true);
        });

        it('should not exists', async () => {
            const res = await crud.exists({});
            expect(res).to.be.equal(false);
        });
    });

    describe('fetchAll', () => {
        it('should return a non empty collection', async () => {
            const data = await crud.fetchAll();
            expect(data).to.be.an('array');
            expect(data).to.not.be.empty;
        });

        it('should filter', async () => {
            const name = uuid();

            await crud.create({
                name,
            });

            const data = await crud.fetchAll({
                name,
            });

            expect(data).to.be.an('array');
            expect(data.length).to.equal(1);
            expect(data[0]).to.have.property('name').to.equal(name);
        });

        it('should limit', async () => {
            await crud.create({
                name: uuid(),
            });

            await crud.create({
                name: uuid(),
            });

            const data = await crud.fetchAll({}, 2);

            expect(data).to.be.an('array');
            expect(data.length).to.be.equal(2);
        });
    });

    describe('fetchById', () => {
        it('should fetch an item and return it', async () => {
            const item = await crud.fetchById(testData.id);
            expect(item).to.be.an('object');
            expect(item).to.have.property('id');
            expect(item.id).to.be.equal(testData.id);
        });

        it('should fetch a non existent item and return nil', async () => {
            const item = await crud.fetchById(500000);
            expect(item).to.be.an('undefined');
        });

        it('should include related models', async () => {
            const item = await crud.fetchById(testData.id, true, {withRelated: ['products']});
            expect(item).to.have.property('products');
            expect(item.products).to.be.an('array');
            expect(item.products).to.not.be.empty;
        });
    });

    describe('updateById', () => {
        it('should update a defined item', async () => {
            const name = uuid();
            const updated = await crud.updateById(testData.id, {
                name,
            });

            expect(updated).to.be.an('object');
            expect(updated).to.have.property('id');
            expect(updated.id).to.be.equal(testData.id);
            expect(updated).to.have.property('name');
            expect(updated.name).to.be.equal(name);
        });

        it('should not update an undefined item', async () => {
            const updated = await crud.updateById(500000, {
                name: uuid(),
            });

            expect(updated).to.be.an('undefined');
        });
    });


});
