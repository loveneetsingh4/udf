const MobileForm = () => {
  return (
    <div className="form-group">
      <label>Mobile Number</label>
      <input
        name="mobileNumber"
        type="text"
        {...register("mobileNumber")}
        className={`form-control ${errors.mobileNumber ? "is-invalid" : ""}`}
      />
      <div className="invalid-feedback">{errors.mobileNumber?.message}</div>
    </div>
  );
};

export default MobileForm;
