Testing for mongoose util
```javascript
import { Model, Document, FilterQuery, UpdateQuery } from 'mongoose';
import { EntityRepository } from './entity-repository';

// Fake entity type
interface TestEntity extends Document {
  name: string;
}

// Concrete repo for testing
class TestRepository extends EntityRepository<TestEntity> {}

describe('EntityRepository (Jest)', () => {
  let repository: TestRepository;
  let mockModel: jest.Mocked<Model<TestEntity>>;

  beforeEach(() => {
    mockModel = {
      findOne: jest.fn(),
      find: jest.fn(),
      findOneAndUpdate: jest.fn(),
      deleteMany: jest.fn(),
    } as any;

    repository = new TestRepository(mockModel);
  });

  it('should call findOne with correct query', async () => {
    const fakeResult = { name: 'Alice' } as TestEntity;
    (mockModel.findOne as jest.Mock).mockReturnValue({
      exec: () => Promise.resolve(fakeResult),
    });

    const result = await repository.findOne({ name: 'Alice' } as FilterQuery<TestEntity>);
    expect(mockModel.findOne).toHaveBeenCalledWith(
      { name: 'Alice' },
      expect.any(Object)
    );
    expect(result).toEqual(fakeResult);
  });

  it('should call find with correct query', async () => {
    const fakeResults = [{ name: 'Bob' }] as TestEntity[];
    (mockModel.find as jest.Mock).mockReturnValue({
      exec: () => Promise.resolve(fakeResults),
    });

    const result = await repository.find({ name: 'Bob' } as FilterQuery<TestEntity>);
    expect(mockModel.find).toHaveBeenCalledWith({ name: 'Bob' });
    expect(result).toEqual(fakeResults);
  });

  it('should create and save an entity', async () => {
    const saveMock = jest.fn().mockResolvedValue({ name: 'Charlie' } as TestEntity);

    // Mock `new this.entityModel()`
    (mockModel as any).constructor = jest.fn().mockReturnValue({ save: saveMock });

    const result = await repository.create({ name: 'Charlie' });
    expect(saveMock).toHaveBeenCalled();
    expect(result).toEqual({ name: 'Charlie' } as TestEntity);
  });

  it('should call findOneAndUpdate with correct params', async () => {
    const fakeUpdated = { name: 'Delta' } as TestEntity;
    (mockModel.findOneAndUpdate as jest.Mock).mockReturnValue({
      exec: () => Promise.resolve(fakeUpdated),
    });

    const result = await repository.findOneAndUpdate(
      { name: 'Delta' } as FilterQuery<TestEntity>,
      { $set: { name: 'Delta' } } as UpdateQuery<unknown>
    );

    expect(mockModel.findOneAndUpdate).toHaveBeenCalledWith(
      { name: 'Delta' },
      { $set: { name: 'Delta' } },
      expect.objectContaining({ new: true })
    );
    expect(result).toEqual(fakeUpdated);
  });

  it('should return true if deleteMany deleted at least one doc', async () => {
    (mockModel.deleteMany as jest.Mock).mockResolvedValue({ deletedCount: 2 });

    const result = await repository.deleteMany({ name: 'Eve' } as FilterQuery<TestEntity>);
    expect(mockModel.deleteMany).toHaveBeenCalledWith({ name: 'Eve' });
    expect(result).toBe(true);
  });

  it('should return false if deleteMany deleted none', async () => {
    (mockModel.deleteMany as jest.Mock).mockResolvedValue({ deletedCount: 0 });

    const result = await repository.deleteMany({ name: 'Eve' } as FilterQuery<TestEntity>);
    expect(result).toBe(false);
  });
});

```
