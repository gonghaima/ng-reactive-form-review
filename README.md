import { Model, Document, FilterQuery, UpdateQuery } from 'mongoose';
import { EntityRepository } from './entity-repository';

// Create a fake entity type
interface TestEntity extends Document {
  name: string;
}

// Concrete repo for testing
class TestRepository extends EntityRepository<TestEntity> {}

describe('EntityRepository', () => {
  let repository: TestRepository;
  let mockModel: jasmine.SpyObj<Model<TestEntity>>;

  beforeEach(() => {
    mockModel = jasmine.createSpyObj<Model<TestEntity>>('Model', [
      'findOne',
      'find',
      'findOneAndUpdate',
      'deleteMany',
    ]);

    // Special handling for save() since it's on the entity instance, not the model
    (mockModel as any).prototype.save = jasmine.createSpy('save');

    repository = new TestRepository(mockModel);
  });

  it('should call findOne with the correct query', async () => {
    const fakeResult = { name: 'Alice' } as TestEntity;
    mockModel.findOne.and.returnValue({
      exec: () => Promise.resolve(fakeResult),
    } as any);

    const result = await repository.findOne({ name: 'Alice' } as FilterQuery<TestEntity>);
    expect(mockModel.findOne).toHaveBeenCalledWith(
      { name: 'Alice' },
      jasmine.any(Object)
    );
    expect(result).toEqual(fakeResult);
  });

  it('should call find with the correct query', async () => {
    const fakeResults = [{ name: 'Bob' }] as TestEntity[];
    mockModel.find.and.returnValue({
      exec: () => Promise.resolve(fakeResults),
    } as any);

    const result = await repository.find({ name: 'Bob' } as FilterQuery<TestEntity>);
    expect(mockModel.find).toHaveBeenCalledWith({ name: 'Bob' });
    expect(result).toEqual(fakeResults);
  });

  it('should create and save an entity', async () => {
    const saveSpy = jasmine.createSpy().and.resolveTo({ name: 'Charlie' } as TestEntity);
    const fakeEntity = { save: saveSpy };

    spyOn(mockModel as any, 'constructor').and.returnValue(fakeEntity);

    const result = await repository.create({ name: 'Charlie' });
    expect(saveSpy).toHaveBeenCalled();
    expect(result).toEqual({ name: 'Charlie' } as TestEntity);
  });

  it('should call findOneAndUpdate with correct params', async () => {
    const fakeUpdated = { name: 'Delta' } as TestEntity;
    mockModel.findOneAndUpdate.and.returnValue({
      exec: () => Promise.resolve(fakeUpdated),
    } as any);

    const result = await repository.findOneAndUpdate(
      { name: 'Delta' } as FilterQuery<TestEntity>,
      { $set: { name: 'Delta' } } as UpdateQuery<unknown>
    );

    expect(mockModel.findOneAndUpdate).toHaveBeenCalledWith(
      { name: 'Delta' },
      { $set: { name: 'Delta' } },
      jasmine.objectContaining({ new: true })
    );
    expect(result).toEqual(fakeUpdated);
  });

  it('should return true if deleteMany deleted at least one doc', async () => {
    mockModel.deleteMany.and.resolveTo({ deletedCount: 2 } as any);

    const result = await repository.deleteMany({ name: 'Eve' } as FilterQuery<TestEntity>);
    expect(mockModel.deleteMany).toHaveBeenCalledWith({ name: 'Eve' });
    expect(result).toBeTrue();
  });

  it('should return false if deleteMany deleted none', async () => {
    mockModel.deleteMany.and.resolveTo({ deletedCount: 0 } as any);

    const result = await repository.deleteMany({ name: 'Eve' } as FilterQuery<TestEntity>);
    expect(result).toBeFalse();
  });
});
