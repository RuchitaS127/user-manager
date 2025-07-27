using System.ComponentModel.DataAnnotations;

namespace UserManager.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Name is required")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Username is required")]
        public string Username { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; } = string.Empty;

        [RegularExpression(@"^\d{10}$", ErrorMessage = "Phone must be a 10-digit number")]
        public string Phone { get; set; } = string.Empty;

        public bool IsDeleted { get; set; } = false;



        // Reserved for future expansion
        // public Address Address { get; set; } = new();
        // public Company Company { get; set; } = new();
    }
}
