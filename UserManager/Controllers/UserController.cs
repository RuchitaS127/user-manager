using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UserManager.Data;
using UserManager.Models;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;

    public UsersController(AppDbContext context)
        => _context = context;


    [HttpGet]
    public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        => await _context.Users.ToListAsync();


    [HttpGet("validateuser")]
    public async Task<ActionResult<string>> ValidateUserEmail([FromQuery] string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            return BadRequest("Email is required.");

        var exists = await _context.Users
            .AnyAsync(u => u.Email.ToLower() == email.ToLower());

        return exists ? "Email already exists." : "";
    }


    [HttpGet("{id}")]
    public async Task<ActionResult<User>> GetUser(int id)
    {
        var user = await _context.Users.FindAsync(id);
        return user is null ? NotFound() : Ok(user);
    }


    [HttpPost]
    public async Task<ActionResult<User>> CreateUser(User user)
    {
        if (user is null)
            return BadRequest("User data is null.");

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
    }



    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(int id, User user)
    {
        if (id != user.Id)
            return BadRequest("ID mismatch.");

        var existingUser = await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == id);
        if (existingUser is null)
            return NotFound("User not found.");

        _context.Entry(user).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet("deleted")]
    public async Task<ActionResult<IEnumerable<User>>> GetDeletedUsers()
    {
        var deletedUsers = await _context.Users
       .IgnoreQueryFilters()
       .Where(u => u.IsDeleted)
       .ToListAsync();

        return Ok(deletedUsers);
    }


    [HttpPatch("restore/{id}")]
    public async Task<IActionResult> RestoreUser(int id)
    {
        var user = await _context.Users
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null || !user.IsDeleted) return NotFound();

        user.IsDeleted = false;
        await _context.SaveChangesAsync();

        return Ok();
    }
    [HttpPatch("softdelete/{id}")]
    public async Task<IActionResult> SoftDeleteUser(int id)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
        if (user == null) return NotFound();

        user.IsDeleted = true;
        await _context.SaveChangesAsync();

        return Ok();
    }


}
