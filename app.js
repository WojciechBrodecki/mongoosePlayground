const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test', { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async () => {

  const testSchema = new mongoose.Schema({
    id: { type: 'String' },
    nestedObject: {
      type: {
        someProperty: { type: 'String' },
      }
    }
  });
  console.log('===========schema===========')
  console.log(JSON.stringify(testSchema));
  console.log('============================')

  const TestModel = mongoose.model('Kitten', testSchema);
  await TestModel.remove({}).exec();
  console.log(`Element count: ${await TestModel.count({}).exec()}`);

  const firstData = new TestModel({
    id: '1',
    nestedObject: {
      someProperty: 'jakies dane',
    }
  });
  const firstSave = await firstData.save();
  console.log(firstSave.toObject());

  testSchema.pre(/^(findOneAndUpdate|updateOne)$/, function (next) {
    console.log('===========prehook===========')
    console.log(this.getUpdate());
    console.log('===========prehook===========')
    next()
  });

  const update = { id: '2', nestedObject: {} };

  await TestModel.findOneAndUpdate({ id: '1' }, update);
  console.log('2. ', (await TestModel.findOne({ id: '2' }).exec()).toObject());
  await db.close();
});