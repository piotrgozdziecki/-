using UnityEngine;

namespace DTAGraniczna.Camera
{
    /// <summary>
    /// High-Fidelity 2.5D Isometric Camera Controller.
    /// Locks at a 45-degree pitch/yaw angle, follows the vehicle smoothly,
    /// and incorporates impact trauma shake and speed-dependent dynamic framing.
    /// </summary>
    public class IsometricCamera25D : MonoBehaviour
    {
        [Header("Target & Positioning")]
        [SerializeField] private Transform target;
        [SerializeField] private Vector3 isometricAngle = new Vector3(45f, 45f, 0f);
        [SerializeField] private float baseDistance = 22f;
        [SerializeField] private float smoothSpeed = 8f;

        [Header("Dynamic Speed Zoom")]
        [SerializeField] private float minFov = 42f;
        [SerializeField] private float maxFov = 58f;
        [SerializeField] private Rigidbody targetRb;

        private Camera cam;
        private float trauma = 0f;
        private Vector3 currentVelocity;

        private void Awake()
        {
            cam = GetComponent<Camera>();
            transform.rotation = Quaternion.Euler(isometricAngle);
        }

        private void LateUpdate()
        {
            if (target == null) return;

            // Compute ideal isometric offset vector
            Vector3 offset = Quaternion.Euler(isometricAngle) * new Vector3(0f, 0f, -baseDistance);
            Vector3 desiredPosition = target.position + offset;

            // Apply trauma screen shake
            if (trauma > 0f)
            {
                float shakeMagnitude = trauma * trauma * 1.5f;
                desiredPosition += new Vector3(
                    (Mathf.PerlinNoise(Time.time * 25f, 0f) - 0.5f) * shakeMagnitude,
                    (Mathf.PerlinNoise(0f, Time.time * 25f) - 0.5f) * shakeMagnitude,
                    0f
                );
                trauma = Mathf.Clamp01(trauma - Time.deltaTime * 1.2f);
            }

            transform.position = Vector3.SmoothDamp(transform.position, desiredPosition, ref currentVelocity, 1f / smoothSpeed);

            // Dynamic FOV based on reach truck velocity
            if (targetRb != null && cam != null)
            {
                float speed = targetRb.linearVelocity.magnitude;
                float targetFov = Mathf.Lerp(minFov, maxFov, speed / 12f);
                cam.fieldOfView = Mathf.Lerp(cam.fieldOfView, targetFov, Time.deltaTime * 3f);
            }
        }

        public void AddScreenShake(float traumaAmount)
        {
            trauma = Mathf.Clamp01(trauma + traumaAmount);
        }
    }
}
