import { User } from "../models/user.model.js";
export async function addAddress(req, res) {
  try {
    const {
      label,
      fullName,
      streetAddress,
      city,
      state,
      zipCode,
      phoneNumber,
      isDefault,
    } = req.body;
    const user = req.user;
    // if this is set as default, unset previous default
    if (isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    user.addresses.push({
      label,
      fullName,
      streetAddress,
      city,
      state,
      zipCode,
      phoneNumber,
      isDefault: isDefault || false,
    });
    await user.save();
    res.status(201).json({
      status: "success",
      message: "Address added successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    console.log("Error in addAddress controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
export async function getAddresses(req, res) {
  try {
    const user = req.user;
    res.status(200).json({
      status: "success",
      addresses: user.addresses,
    });
  } catch (error) {
    console.log("Error in getAddresses controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
export async function updateAddress(req, res) {
  try {
    const {
      label,
      fullName,
      streetAddress,
      city,
      state,
      zipCode,
      phoneNumber,
      isDefault,
    } = req.body;

    const { addressId } = req.params;
    const user = req.user;
    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ error: "Address not found" });
    }
    // if this is set as default, unset previous default
    if (isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    address.label = label || address.label;
    address.fullName = fullName || address.fullName;
    address.streetAddress = streetAddress || address.streetAddress;
    address.city = city || address.city;
    address.state = state || address.state;
    address.zipCode = zipCode || address.zipCode;
    address.phoneNumber = phoneNumber || address.phoneNumber;
    address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;
    await user.save();
    res.status(200).json({
      status: "success",
      message: "Address updated successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    console.log("Error in updateAddress controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
export async function deleteAddress(req, res) {
  try {
    const { addressId } = req.params;
    const user = req.user;
    user.addresses.pull(addressId);
    await user.save();
    res.status(200).json({
      status: "success",
      message: "Address deleted successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    console.log("Error in deleteAddress controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function addToWhishlist(req, res) {
  try {
    const { productId } = req.body;
    const user = req.user;
    // check if product already in whishlist
    if (user.whishlist.includes(productId)) {
      return res.status(400).json({ error: "Product already in whishlist" });
    }
    user.whishlist.push(productId);
    await user.save();
    res.status(200).json({
      status: "success",
      message: "Product added to whishlist successfully",
      whishlist: user.whishlist,
    });
  } catch (error) {
    console.log("Error in addToWhishlist controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
export async function removeFromWhishlist(req, res) {
  try {
    const { productId } = req.params;
    const user = req.user;
    // check if product is  in whishlist
    if (!user.whishlist.includes(productId)) {
      return res.status(400).json({ error: "Product not in whishlist" });
    }
    user.whishlist.pull(productId);
    await user.save();
    res.status(200).json({
      status: "success",
      message: "Product removed from whishlist successfully",
      whishlist: user.whishlist,
    });
  } catch (error) {
    console.log("Error in removeFromWhishlist controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
export async function getWhishlist(req, res) {
  try {
    const user = req.user;
    res.status(200).json({
      status: "success",
      whishlist: user.whishlist,
    });
  } catch (error) {
    console.log("Error in getWhishlist controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
