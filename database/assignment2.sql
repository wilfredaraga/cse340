-- Add Tony Stark as an account
INSERT INTO public.account(
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
-- Make Tony Stark an Admin
UPDATE public.account
SET account_type = 'Admin'
WHERE account_firstname = 'Tony'
    AND account_lastname = 'Stark';
-- Delete Tony Stark from accounts
DELETE FROM public.account
WHERE account_firstname = 'Tony'
    AND account_lastname = 'Stark';
-- Update the description of the GM Hummer to say "a huge interior" instead of "the small interiors"
UPDATE public.inventory
SET inv_description = REPLACE(
        inv_description,
        'the small interiors',
        'a huge interior'
    )
WHERE inv_make = 'GM'
    AND inv_model = 'Hummer';
-- List all of the vehicles that are classified as 'Sport'
SELECT inv_make,
    inv_model,
    classification_name
FROM public.inventory
    INNER JOIN public.classification ON inventory.classification_id = classification.classification_id
WHERE classification_name = 'Sport';
-- Update all image paths to have a /vehicles/ directory in the path
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, 'images', 'images/vehicles'),
    inv_thumbnail = REPLACE(inv_image, 'images', 'images/vehicles');