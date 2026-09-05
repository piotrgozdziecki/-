using UnityEngine;
using System;

namespace DTAGraniczna.Vehicles
{
    /// <summary>
    /// Realistic Physics-Based Controller for the Toyota BT Reflex Reach Truck.
    /// Handles rear-wheel Ackermann steering, inertia, epoxy floor drift, and ramming impacts.
    /// </summary>
    [RequireComponent(typeof(Rigidbody))]
    public class ToyotaBTRigidBodyPhysics : MonoBehaviour
    {
        [Header("Vehicle Specifications")]
        [SerializeField] private float motorTorque = 1800f;
        [SerializeField] private float maxSpeedKmh = 32f;
        [SerializeField] private float reverseTorque = 1200f;
        [SerializeField] private float brakeForce = 3500f;
        [SerializeField] private float maxSteerAngle = 75f; // Reach trucks have extreme turning radius

        [Header("Weight & Counterweight Distribution")]
        [SerializeField] private Vector3 centerOfMassOffset = new Vector3(0f, -0.4f, -0.6f);
        [SerializeField] private float massKg = 3400f; // Industrial reach truck weight

        [Header("Epoxy Floor Friction & Drift")]
        [SerializeField] private float forwardFriction = 1.0f;
        [SerializeField] private float sidewaysDriftFriction = 0.42f; // Low lateral friction for smooth warehouse drifting
        [SerializeField] private float driftAngularDrag = 2.5f;

        [Header("Mast & Fork Assembly")]
        [SerializeField] private Transform forkCarriage;
        [SerializeField] private BoxCollider forkCollider;
        [SerializeField] private float rammingDamageMultiplier = 1.8f;

        private Rigidbody rb;
        private float currentSteerAngle = 0f;
        private float currentThrottle = 0f;
        private bool isBraking = false;
        private bool isDashActive = false;

        private void Awake()
        {
            rb = GetComponent<Rigidbody>();
            rb.mass = massKg;
            rb.centerOfMass = centerOfMassOffset;
            rb.interpolation = RigidbodyInterpolation.Interpolate;
        }

        private void FixedUpdate()
        {
            ApplySteeringPhysics();
            ApplyMotorForce();
            ApplyFrictionalDrag();
            SendTelemetryToAndroid();
        }

        public void OnDriveInput(string jsonInput)
        {
            // Parse JSON from Android Kotlin bridge: {"steer": 0.5, "throttle": 1.0, "brake": false}
            try
            {
                DriveInputData data = JsonUtility.FromJson<DriveInputData>(jsonInput);
                currentSteerAngle = Mathf.Clamp(data.steer * maxSteerAngle, -maxSteerAngle, maxSteerAngle);
                currentThrottle = Mathf.Clamp(data.throttle, -1f, 1f);
                isBraking = data.brake;
            }
            catch (Exception e)
            {
                Debug.LogError($"Error parsing drive input: {e.Message}");
            }
        }

        public void OnDashTriggered(string unused = "")
        {
            if (!isDashActive)
            {
                StartCoroutine(DashCoroutine());
            }
        }

        private System.Collections.IEnumerator DashCoroutine()
        {
            isDashActive = true;
            rb.AddForce(transform.forward * (motorTorque * 3.5f), ForceMode.Impulse);
            yield return new WaitForSeconds(0.45f);
            isDashActive = false;
        }

        private void ApplySteeringPhysics()
        {
            // Reach trucks pivot sharply around the front axle using rear drive/steer wheel
            if (Mathf.Abs(currentThrottle) > 0.05f || rb.linearVelocity.magnitude > 0.5f)
            {
                float turnSpeed = currentSteerAngle * (rb.linearVelocity.magnitude / (maxSpeedKmh / 3.6f)) * Time.fixedDeltaTime;
                Quaternion turnRotation = Quaternion.Euler(0f, turnSpeed * 45f, 0f);
                rb.MoveRotation(rb.rotation * turnRotation);
            }
        }

        private void ApplyMotorForce()
        {
            float currentSpeedKmh = rb.linearVelocity.magnitude * 3.6f;

            if (isBraking)
            {
                rb.linearDamping = brakeForce / 500f;
                return;
            }

            rb.linearDamping = 0.2f;

            if (currentThrottle > 0.05f && currentSpeedKmh < maxSpeedKmh)
            {
                rb.AddForce(transform.forward * (currentThrottle * motorTorque), ForceMode.Force);
            }
            else if (currentThrottle < -0.05f && currentSpeedKmh < (maxSpeedKmh * 0.5f))
            {
                rb.AddForce(-transform.forward * (Mathf.Abs(currentThrottle) * reverseTorque), ForceMode.Force);
            }
        }

        private void ApplyFrictionalDrag()
        {
            // Simulate epoxy floor side-slip (drift mechanics)
            Vector3 localVel = transform.InverseTransformDirection(rb.linearVelocity);
            localVel.x *= (1.0f - sidewaysDriftFriction * Time.fixedDeltaTime);
            rb.linearVelocity = transform.TransformDirection(localVel);
        }

        private void OnCollisionEnter(Collision collision)
        {
            // High-impact collision response with shadow hordes / crates
            float impactForce = collision.relativeVelocity.magnitude * rb.mass;
            if (impactForce > 4000f)
            {
                // Trigger camera shake and damage in Unity
                float damage = (impactForce / 1000f) * rammingDamageMultiplier;
                Debug.Log($"Forklift Rammed Object with Force: {impactForce:F0}N (Damage: {damage:F0})");
            }
        }

        private void SendTelemetryToAndroid()
        {
            float speedKmh = rb.linearVelocity.magnitude * 3.6f;
            Vector3 localVel = transform.InverseTransformDirection(rb.linearVelocity);
            float slipAngle = Mathf.Atan2(localVel.x, localVel.z) * Mathf.Rad2Deg;

            UnityAndroidBridge.SendVehicleTelemetry(speedKmh, 95f, rb.angularVelocity.magnitude, slipAngle);
        }

        [Serializable]
        private class DriveInputData
        {
            public float steer;
            public float throttle;
            public bool brake;
        }
    }
}
