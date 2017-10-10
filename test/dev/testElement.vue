<template>
  <div>
    <form-group :validator="$v.test" label="Test" :validator-params="validatorParams">
      <template scope="props">
        <input type="text"
               v-model="test"
               @input="$v.test.$touch()">
      </template>
    </form-group>
  </div>
</template>
<script>
  import { required, minLength, maxLength } from 'vuelidate/lib/validators'

  export default {
    data () {
      return {
        test: '',
        validatorParams: {
          deeply: {
            nested: {
              value: 'is really deep'
            }
          }
        }
      }
    },
    validations: {
      test: {
        required,
        minLength: minLength(5),
        maxLength: maxLength(10),
        deep: maxLength(5)
      }
    }
  }
</script>
