<template>
  <div>
    <form-wrapper :validator="$v.nestedObject">
      <multi-error-extractor/>
    </form-wrapper>
    <h3>Plain FormField</h3>
    <form-group
      :validator="$v.test"
      label="Test"
      name="test"
    >
      <input
        type="text"
        v-model="test"
        @input="$v.test.$touch()"
      >
    </form-group>
    <h3>Form Field with Just Form wrapper</h3>
    <form-wrapper :validator="$v.nestedObject">
      <form-group
        name="first_name"
        label="First name"
      >
        <template slot-scope="{ validator, hasErrors, attributes, events }">
          <input
            v-bind="attributes"
            v-on="events"
            type="text"
            v-model="nestedObject.first_name"
          >
        </template>
      </form-group>
    </form-wrapper>
    <h3> Form Field With Wrapper And Message override on it</h3>
    <form-wrapper
      :validator="$v.nestedObject"
      :messages="messages"
    >
      <form-group
        name="first_name"
        label="First name"
      >
        <template slot-scope="{ validator, hasErrors, attributes, events }">
          <input
            v-bind="attributes"
            v-on="events"
            type="text"
            v-model="nestedObject.first_name"
          >
        </template>
      </form-group>
    </form-wrapper>
    <h3>Form Field With Wrapper and Local Messages Override</h3>
    <form-wrapper
      :validator="$v.nestedObject"
      :messages="messages"
    >
      <form-group
        label="First Name"
        name="first_name"
        :messages="{ required: 'validations.required_further_extended'}"
      >
        <template slot-scope="{ validator, hasErrors, attributes, events }">
          <input
            v-bind="attributes"
            v-on="events"
            type="text"
            v-model="nestedObject.first_name"
          >
        </template>
      </form-group>
    </form-wrapper>
    <h3>Top level Form Field with Wrapper and Validator override</h3>
    <form-wrapper :validator="$v.nestedObject">
      <form-group
        name="last_name"
        label="Nested Last Name"
      >
        <input
          type="text"
          v-model="nestedObject.last_name"
          @input="$v.nestedObject.last_name.$touch()"
        >
      </form-group>
    </form-wrapper>
    <h3>Deep nested FormField without Wrapper</h3>
    <form-group
      :validator="$v.nestedObject.address.postal"
      label="Deep Postal"
      attribute="Postal"
    >
      <input
        type="text"
        v-model="nestedObject.address.postal"
        @input="$v.nestedObject.address.postal.$touch()"
      >
    </form-group>
    <h3>Form field within Each</h3>
    <form-wrapper
      :validator="$v.nestedObject"
      :messages="messages"
    >
      <form-group
        name="phones.$each.0.model"
        label="First Phone models"
      >
        <template slot-scope="{ attributes, events }">
          <input
            v-bind="attributes"
            v-on="events"
            type="text"
            v-model="nestedObject.phones[0].model"
          >
        </template>
      </form-group>
    </form-wrapper>
    <button
      class="button"
      @click="$v.$touch()"
    >
      Touch
    </button>
  </div>
</template>
<script>
import { required, minLength, maxLength, email, numeric } from 'vuelidate/lib/validators'
import MultiErrorExtractor from '../../src/templates/multi-error-extractor/bootstrap3'
import FormWrapper from '../../src/templates/form-wrapper'

export default {
  components: {
    MultiErrorExtractor,
    FormWrapper
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
        required: 'validations.required_extended'
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
