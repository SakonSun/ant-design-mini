import { FormTextareaDefaultProps } from './props';
import { createForm } from '../form';
import fmtEvent from '../../_util/fmtEvent';


Component({
  props: FormTextareaDefaultProps,
  mixins: [createForm()],  
  methods: {
    handleRef(input) {
      this.input = input;
    },
    setFormData(values) {
      this.setData({
        ...this.data,
        formData: {
          ...this.data.formData,
          ...values,
        }
      });
      this.input.update(this.data.formData.value);  
    },
    onChange(value, e) {
      this.emit('onChange', value);
      if (this.props.onChange) {
        this.props.onChange(value, fmtEvent(this.props, e));
      }
    },
    onBlur(value, e) {
      if (this.props.onBlur) {
        this.props.onBlur(value, fmtEvent(this.props, e));
      }
    },
    onFocus(value, e) {
      if (this.props.onChange) {
        this.props.onFocus(value, fmtEvent(this.props, e));
      }
    },
    onConfirm(value, e) {
      if (this.props.onConfirm) {
        this.props.onConfirm(value, fmtEvent(this.props, e));
      }
    },
    onClear(value, e) {
      this.emit('onChange', '');
      if (this.props.onChange) {
        this.props.onChange(value, fmtEvent(this.props, e));
      }
    },
  }
});