const mongoose   = require('mongoose')
const bcrypt     = require('bcrypt')
const saltRounds = 10

const UserSchema = new mongoose.Schema ({
  email:      { type: String, unique: true },
  password:   { type: String }
})

UserSchema.pre('save', async function(next) {
  try {
    if (!this.isModified('password')) return next()

    const hashedPassword = await bcrypt.hash(this.password, saltRounds)

    this.password = hashedPassword
    next()

  } catch (error) {
    console.log('Password Hash Error', error)
    next()
  }
})

UserSchema.methods.comparePassword = function(password) {
  try {
    return bcrypt.compare(password, this.password)
  } catch (error) {
    throw error
  }
}

module.exports = mongoose.model('User', UserSchema)