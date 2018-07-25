<template>
  <div>
    <form-wrapper :validator="$v.nestedObject" :messages="messages">
      <multi-error-extractor/>
      <form-group name="first_name" label="First name">
        <template slot-scope="{ validator, hasErrors, attributes, events }">
          <input
            v-bind="attributes"
            v-on="events"
            type="text"
            v-model="nestedObject.first_name">
        </template>
      </form-group>
      <form-group label="Test" attribute="Test Field">
        <input type="text"
               v-model="test"
               @input="$v.test.$touch()">
      </form-group>
      <form-group label="First Name" name="first_name">
        <input type="text"
               v-model="nestedObject.first_name"
               @input="$v.nestedObject.first_name.$touch()">
      </form-group>
      <form-group :validator="$v.nestedObject.last_name" label="Nested Last Name" attribute="Last name">
        <input type="text"
               v-model="nestedObject.last_name"
               @input="$v.nestedObject.last_name.$touch()">
      </form-group>
      <form-group label="Deep City" attribute="Deep City Field" name="address.city">
        <input type="text"
               v-model="nestedObject.address.city"
               @input="$v.nestedObject.address.city.$touch()">
      </form-group>
      <form-group :validator="$v.nestedObject.address.postal" label="Deep Postal" attribute="Postal">
        <input type="text"
               v-model="nestedObject.address.postal"
               @input="$v.nestedObject.address.postal.$touch()">
      </form-group>
      <form-group name="phones.$each.0.model" label="First Phone models">
        <template slot-scope="{ attributes, events }">
          <input
            v-bind="attributes"
            v-on="events"
            type="text"
            v-model="nestedObject.phones[0].model">
        </template>
      </form-group>
      <button class="button" @click="$v.nestedObject.$touch()">Touch</button>
    </form-wrapper>
  </div>
</template>
<script>
import { required, minLength, maxLength, email, numeric } from 'vuelidate/lib/validators'
import MultiErrorExtractor from '../../src/templates/multi-error-extractor/bootstrap3'
import formWrapper from '../../src/templates/form-wrapper'

export default {
  components: {
    MultiErrorExtractor,
    formWrapper
  },
  data () {
    return {
      test: '',
      nestedObject: {
        first_name: '',
        last_name: '',
        email: '',
        address: {
          street: '',
          city: '',
          postal: ''
        },
        phones: [
          {
            model: '',
            brand: ''
          }
        ]
      },
      attributesMap: {
        first_name: 'First Name',
        last_name: 'Last Name',
        email: 'Email',
        'address.street': 'Street',
        'address.city': 'City',
        'address.postal': 'Postal Code'
      },
      messages: {
        numeric: '{attribute} needs to be numeric.'
      }
    }
  },
  validations: {
    test: {
      required,
      minLength: minLength(5),
      maxLength: maxLength(10)
    },
    nestedObject: {
      first_name: { required, minLength: minLength(3), maxLength: maxLength(20), numeric },
      last_name: { required, minLength: minLength(3), maxLength: maxLength(20) },
      email: { required, email },
      address: {
        street: { required, minLength: minLength(5) },
        city: { required, minLength: minLength(5) },
        postal: { required }
      },
      phones: {
        $each: {
          model: { required },
          brand: { minLength: minLength(8) }
        }
      }
    }
  }
}
</script>
